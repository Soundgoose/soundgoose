import { generateWaitlistEmailHtml } from "../email";

export default function EmailPreviewPage() {
  // In browser preview, replace the email attachment cid: with the local /logo.png path
  const html = generateWaitlistEmailHtml().replace(
    'src="cid:soundgoose-logo"',
    'src="/logo.png"'
  );

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <iframe
        srcDoc={html}
        title="Email Preview"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
