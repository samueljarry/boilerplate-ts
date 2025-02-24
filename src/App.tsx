import '@styles/styles.scss';

import { useEffect, useState } from 'react';

import { Main } from './Main';
import { ReactViewBase } from '@core/common/bases/views/react/ReactViewBase';
import { ViewId } from '@constants/LayoutConstants';
import { ViewsManager } from './core/common/managers/ViewsManager';

export const App = () => {
  const [init, setInit] = useState(Main.IsInit);
  const [loadingVisible, setLoadingVisible] = useState(!Main.IsInit);
  const [views, setViews] = useState<ReactViewBase[]>();

  useEffect(() => {
    const onInit = () => {
      setInit(Main.IsInit);
      if (Main.IsInit) {
        Main.Start();
        setLoadingVisible(false)
      }
    }


    const onViewsChange = () => {
      let displayedViews = []
      for (const view of ViewsManager.GetDisplayedViews().values()) {
        if (view instanceof ReactViewBase) {
          const ViewComponent = view.component as React.ComponentType<{ viewId: ViewId }>;
          displayedViews.push(<ViewComponent viewId={view.viewId} key={view.viewId} />);
        }
      }
      setViews(displayedViews);
    }

    onInit();
    onViewsChange();

    Main.OnInit.add(onInit);
    ViewsManager.OnViewsChange.add(onViewsChange);

    return () => {
      Main.OnInit.remove(onInit);
      ViewsManager.OnViewsChange.remove(onViewsChange);
    }
  }, [])

  return (
    <>
      {loadingVisible && ('Loading')}
      {init && views}
    </>
  )
}