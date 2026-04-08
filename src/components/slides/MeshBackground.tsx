export function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="mesh-blob w-[600px] h-[600px] bg-indigo/10 -top-[10%] -left-[10%]" style={{ animationDelay: '0s' }}></div>
      <div className="mesh-blob w-[500px] h-[500px] bg-[#6C63FF]/10 -bottom-[10%] -right-[5%]" style={{ animationDelay: '-5s' }}></div>
      <div className="mesh-blob w-[400px] h-[400px] bg-indigo/5 top-[20%] right-[10%]" style={{ animationDelay: '-2s' }}></div>
    </div>
  );
}
