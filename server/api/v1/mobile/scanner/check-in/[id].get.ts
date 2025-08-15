export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const query = getQuery(event);

  // Redirect to frontend page with same parameters
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();
  const redirectUrl = `/mobile/scanner/check-in/${id}${
    queryString ? `?${queryString}` : ""
  }`;

  console.log(`Redirecting API call to frontend: ${redirectUrl}`);

  await sendRedirect(event, redirectUrl, 302);
});
