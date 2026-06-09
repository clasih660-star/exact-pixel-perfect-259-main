import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/teaching')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo/teaching"!</div>
}
