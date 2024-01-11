export function filterRouteForId(
  level: number | string,
  pId: number | string,
  routes: any[],
  tag: number = 1
) {
  const theRoutes = routes.filter((route) => {
    // route.button_id == level &&
    return (
      (!route.is_btn || route.is_btn == tag) &&
      route.menu_pid == pId &&
      route.page_url
    );
  });
  theRoutes.forEach((route) => {
    const isRoutes = filterRouteForId(
      Number(route.button_id) + 1,
      route.id,
      routes,
      tag
    );
    if (isRoutes.length > 0) {
      route.children = isRoutes;
    }
  });
  const theRoute = theRoutes.sort((a: any, b: any) => {
    return Number(a.menu_sort) - Number(b.menu_sort);
  });

  return theRoute;
}
