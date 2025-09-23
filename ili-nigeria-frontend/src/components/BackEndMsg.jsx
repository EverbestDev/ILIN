import { useEffect } from "react";

export default function BackEndMsg() {
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => {
        window.alert(data);
      });
  }, []);

  return null;
}
