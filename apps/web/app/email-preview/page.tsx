import { generateWaitlistEmailHtml } from "../email";
import { generateNewsletterEmailHtml } from "../components/newsletter-email-template";

interface EmailPreviewProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function EmailPreviewPage({
  searchParams,
}: EmailPreviewProps) {
  const { type } = await searchParams;
  const isNewsletter = type === "newsletter";

  const rawHtml = isNewsletter
    ? generateNewsletterEmailHtml({
        issueNumber: 1,
        title:
          "Low-Latency Spatial Audio in the Browser: The WebAudio Worklet Blueprint",
        slug: "low-latency-spatial-audio-in-the-browser",
        emailExcerpt:
          "In our inaugural technical dispatch, we break down our WebAudio Worklet architecture, zero-allocation circular audio rings, and 3 measured takeaways for real-time web audio.",
        tldr: [
          "Direct main-thread WebAudio processing introduces unpreventable frame jitter and audio glitches whenever React renders.",
          "Offloading DSP into AudioWorklet processors with pre-allocated SharedArrayBuffers cuts round-trip acoustic latency to 5.8ms.",
          "Circular ring buffers bypass the JavaScript garbage collector entirely, maintaining a rock-solid 60 FPS audio rendering loop.",
        ],
        actionableNextStep:
          "Open your browser console on your current audio project and inspect new AudioContext().baseLatency. If it exceeds 10ms, audit your node graph for redundant script processors.",
      })
    : generateWaitlistEmailHtml();

  // In browser preview, replace the email attachment cid: with the local /logo.png path
  const html = rawHtml.replace('src="cid:soundgoose-logo"', 'src="/logo.png"');

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div
        style={{
          background: "#40271e",
          padding: "10px 18px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
          fontSize: "13px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ color: "#eee5dc", fontWeight: 600 }}>Email Type:</span>
        <a
          href="/email-preview"
          style={{
            color: !isNewsletter ? "#ffffff" : "#d9a689",
            fontWeight: !isNewsletter ? 700 : 400,
            textDecoration: "underline",
          }}
        >
          Waitlist Confirmation
        </a>
        <span style={{ color: "#73513d" }}>|</span>
        <a
          href="/email-preview?type=newsletter"
          style={{
            color: isNewsletter ? "#ffffff" : "#d9a689",
            fontWeight: isNewsletter ? 700 : 400,
            textDecoration: "underline",
          }}
        >
          5-Part Newsletter Dispatch (Preview)
        </a>
      </div>
      <iframe
        srcDoc={html}
        title="Email Preview"
        style={{
          width: "100%",
          height: "calc(100vh - 41px)",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
