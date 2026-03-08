export function Chef3D() {
  return (
    <div className="chef-3d-wrap overflow-hidden rounded-2xl" aria-label="Chef cooking video">
      <video
        className="h-full w-full object-cover object-center"
        src="/video/chef-cooking.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
}
