from fastapi import FastAPI, File, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from diffusers import StableDiffusionImageVariationPipeline
from PIL import Image
from torchvision import transforms
from io import BytesIO
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cpu:0"
pipeline = StableDiffusionImageVariationPipeline.from_pretrained(
    "lambdalabs/sd-image-variations-diffusers",
    revision="v2.0"
)
pipeline = pipeline.to(device)

@app.post("/")
async def generate(file: UploadFile = File(...)):
    contents = await file.read()
    
    im = Image.open(BytesIO(contents))
    
    tform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((224, 224)),
        transforms.Normalize(
            [0.48145466, 0.4578275, 0.40821073],
            [0.26862954, 0.26130258, 0.27577711]
        ),
    ])
    
    inp = tform(im).to(device).unsqueeze(0)
    for i in range(4):
        out = pipeline(inp, guidance_scale=3)
        
        out["images"][0].save(f"out{i}.jpg")
        out_image = out["images"][0]
        output_bytes = BytesIO()
        out_image.save(output_bytes, format="JPEG")
        output_bytes = base64.b64encode(output_bytes.getvalue())
        
        return Response(content=output_bytes, media_type="image/jpeg")