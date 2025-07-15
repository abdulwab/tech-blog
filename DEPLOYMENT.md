# Deployment Guide

## File Upload Limitations in Serverless Environments

### The Issue
When deploying to serverless platforms like **Vercel**, **Netlify**, or **AWS Lambda**, the file system is **read-only**. This means our local file upload feature won't work in production.

### Current Behavior
- ✅ **Local Development**: File uploads work perfectly
- ❌ **Serverless Production**: File uploads fail with error `ENOENT: no such file or directory`

### Solutions

#### Option 1: Use Image URLs (Recommended for Quick Setup)
The easiest solution is to use image hosting services and paste the URLs:

**Free Image Hosting Services:**
- [Imgur](https://imgur.com) - No account required
- [ImgBB](https://imgbb.com) - Simple drag & drop
- [PostImages](https://postimages.org) - Fast and reliable
- [ImageBB](https://imagebb.com) - Multiple formats supported

**How to use:**
1. Upload your image to any hosting service
2. Copy the direct image URL
3. Paste it in the "Add image URL" field

#### Option 2: Integrate Cloud Storage (Recommended for Production)

For a professional setup, integrate with cloud storage:

##### Vercel Blob Storage (Easiest for Vercel deployments)
```bash
npm install @vercel/blob
```

##### AWS S3 Integration
```bash
npm install @aws-sdk/client-s3
```

##### Cloudinary Integration (Most features)
```bash
npm install cloudinary
```

### Implementation Example (Vercel Blob)

Update `app/api/upload/route.ts`:

```typescript
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file = data.get('file') as File
  
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  return NextResponse.json({ url: blob.url });
}
```

### Environment Variables Needed

For cloud storage, add these to your `.env.local`:

```env
# For AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket

# For Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# For Vercel Blob (automatically provided on Vercel)
BLOB_READ_WRITE_TOKEN=your_token
```

### Current Workaround

The application now gracefully handles serverless environments:

1. **Detects serverless environment** automatically
2. **Shows helpful error messages** when upload fails
3. **Provides URL input as fallback** with hosting suggestions
4. **Links to free image hosting services**

### Next Steps

1. **For immediate use**: Use the URL input with free image hosting
2. **For production**: Implement cloud storage integration
3. **For development**: Local uploads continue to work normally

---

## Deployment Checklist

- [ ] Choose image hosting strategy (URL vs Cloud Storage)
- [ ] Set up environment variables if using cloud storage
- [ ] Test image functionality after deployment
- [ ] Update team on image upload workflow 