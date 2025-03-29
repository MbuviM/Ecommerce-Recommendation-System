import { searchByImageUrl } from '@/config/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Validate image URL format
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(imageUrl)) {
      return res.status(400).json({ message: 'Invalid image URL format' });
    }

    const recommendations = await searchByImageUrl(imageUrl);
    
    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Image search error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 