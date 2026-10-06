import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ExternalVideoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)[a-zA-Z0-9_\-\/]+/,
    {
      message: 'Video URL must be a valid YouTube (watch/embed/short) or Vimeo URL',
    },
  )
  videoUrl!: string;
}

export function parseVideoUrl(url: string): {
  provider: 'YOUTUBE' | 'VIMEO';
  videoId: string;
  embedUrl: string;
} {
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'YOUTUBE',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+))/,
  );
  if (vimeoMatch && vimeoMatch[3]) {
    const videoId = vimeoMatch[3];
    return {
      provider: 'VIMEO',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  throw new Error('Unsupported video URL format. Only YouTube and Vimeo are supported.');
}
