import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/student/sessions/$sessionId/replay',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/student/sessions/$sessionId/replay"!</div>
}
