// src/components/HomeComponents/AvatarImage.jsx
import "./Homecomponents.css";

export default function AvatarImage({ src, name, size = 48, className = "" }) {
  const initial = name?.charAt(0).toUpperCase() || "?";

  const style = {
    width:          size,
    height:         size,
    borderRadius:   "50%",
    objectFit:      "cover",
    border:         "2px solid var(--primary)",
    flexShrink:     0,
  };

  const fallbackStyle = {
    ...style,
    background:     "var(--bg)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    color:          "var(--primary)",
    fontWeight:     700,
    fontSize:       size * 0.4,
  };

  if (src) {
    return <img src={src} alt={name} style={style} className={className} />;
  }

  return 
    <div style={fallbackStyle} className={className}>{initial}</div>;
}