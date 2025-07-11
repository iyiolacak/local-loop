'use client';

const Overlay = ({ isOpen, children, onClick }: { isOpen: boolean, children: React.ReactNode, onClick: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Blur + Tint Layer */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClick}
      />

      {/* Kept/Focused Component */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Overlay;
