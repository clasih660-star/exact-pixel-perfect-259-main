import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/simple-test")({
  component: SimpleTest,
});

function SimpleTest() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
      <h1 style={{ color: '#0f172a', fontSize: '24px', fontWeight: 'bold' }}>
        Simple Test Page
      </h1>
      <p style={{ color: '#64748b' }}>
        If you can see this, basic routing and CSS work!
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0',
        borderRadius: '12px'
      }}>
        <p>Inline styles test - no CSS variables needed</p>
      </div>
    </div>
  );
}