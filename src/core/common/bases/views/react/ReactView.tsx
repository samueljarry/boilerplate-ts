import { ForwardedRef, HTMLProps, ReactNode, forwardRef, useEffect, useRef } from "react"

import { ReactViewBase } from "./ReactViewBase";
import { ViewId } from "@constants/ViewId";
import { ViewsManager } from "@core/common/managers/ViewsManager";

export type ReactViewProps = {
  children?: ReactNode;
  viewId: ViewId;
  className?: string;
} & HTMLProps<HTMLDivElement>

export const ReactView = forwardRef(({ children, viewId, className = '', ...props }: ReactViewProps, ref: ForwardedRef<HTMLDivElement>) => {
  const defaultRef = useRef<HTMLDivElement>(null)
  const activeRef = (ref as React.RefObject<HTMLDivElement>) || defaultRef;
  
  useEffect(() => {
    const view = ViewsManager.GetView<ReactViewBase>(viewId);
    view.setHtmlElement(activeRef.current);
  }, [])
  
  return (
    <div id={viewId} className={`view ${className}`} ref={activeRef} {...props}>
      {children}
    </div>
  )
})