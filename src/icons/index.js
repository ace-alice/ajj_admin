const req = require.context('./svg', false, /\.svg$/);
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
export const reqs = requireAll(req);

export default { reqs };
