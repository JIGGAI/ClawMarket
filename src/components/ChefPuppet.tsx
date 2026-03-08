export function ChefPuppet() {
  return (
    <div className="floaty">
      <div className="chef-puppet" role="img" aria-label="Animated chef cooking">
        <div className="chef-shadow" />
        <div className="chef-layer chef-back" />
        <div className="chef-layer chef-body" />
        <div className="chef-layer chef-head" />
        <div className="chef-layer chef-arm-left" />
        <div className="chef-layer chef-arm-right" />

        <div className="chef-pan">
          <span className="chef-steam steam-1" />
          <span className="chef-steam steam-2" />
          <span className="chef-steam steam-3" />
        </div>
      </div>
    </div>
  );
}
