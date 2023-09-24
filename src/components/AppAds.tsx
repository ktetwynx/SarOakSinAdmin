import { useEffect, useState } from "react";

export default function AppAds() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("/app-ad.txt")
      .then((r) => r.text())
      .then((text) => {
        console.log(text);
        setText(text);
      });
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}
