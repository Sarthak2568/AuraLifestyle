import { useRef, useState } from "react";
export default function VirtualTryOn({ overlayImage }) {
  const [userImg, setUserImg] = useState(""); const inputRef = useRef();
  const onFile = (e) => { const f = e.target.files?.[0]; if (!f) return; setUserImg(URL.createObjectURL(f)); };
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Virtual Try-On (preview)</div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="text-sm" />
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded overflow-hidden flex items-center justify-center">
          {userImg ? <img src={userImg} className="h-full object-cover" /> : <span className="text-xs opacity-70">Upload your photo</span>}
        </div>
        <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded overflow-hidden flex items-center justify-center">
          <img src={overlayImage} className="h-full object-cover opacity-90" />
        </div>
      </div>
      <p className="text-xs opacity-70">Note: basic preview (no segmentation).</p>
    </div>
  );
}
