import { useEffect, useRef } from "react"

import { ReactViewBase } from "./ReactViewBase";
import { ViewsManager } from "@core/common/managers/ViewsManager";

export const ReactView = ({ children, viewId, className = '' }) => {
  const ref = useRef<HTMLDivElement>();
  
  useEffect(() => {
    const view = ViewsManager.GetView<ReactViewBase>(viewId);
    view.setHtmlElement(ref.current);
  }, [])
  
  return (
    <div id={viewId} className={`view ${className}`} ref={ref}>
      {children}
    </div>
  )
}