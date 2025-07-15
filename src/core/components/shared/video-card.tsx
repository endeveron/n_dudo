'use client';

export interface VideoCardProps {
  videoId: string;
}

export default function VideoCard({ videoId }: VideoCardProps) {
  return (
    <div className="relative flex-center w-sm h-[216px] rounded-2xl overflow-hidden bg-card shadow-xs">
      <iframe
        className="absolute top-0 left-0 w-full h-full z-10 bg-card"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allowFullScreen
      ></iframe>
      <div className="text-system">Loading...</div>
    </div>
  );
}
