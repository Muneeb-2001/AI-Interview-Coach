$file = "src\app\interview\voice\page.tsx"
$content = Get-Content $file -Raw

$anchor = "  if (completed) {"
$insert = @"
  useEffect(() => {
    let anamClient: ReturnType<typeof createClient> | null = null;
    let cancelled = false;

    const connectAnam = async () => {
      try {
        const response = await fetch("/api/anam-session", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create Anam session.");
        }

        const data = await response.json();

        if (!data.sessionToken) {
          throw new Error("Anam session token was not returned.");
        }

        if (cancelled) return;

        anamClient = createClient(data.sessionToken);

        await anamClient.streamToVideoElement("anam-video");

        if (cancelled) {
          if (anamClient.isStreaming()) {
            await anamClient.stopStreaming();
          }
          return;
        }

        console.log("SUCCESS: Anam live avatar connected.");
      } catch (error) {
        console.error("Anam connection error:", error);
      }
    };

    void connectAnam();

    return () => {
      cancelled = true;

      if (anamClient?.isStreaming()) {
        void anamClient.stopStreaming();
      }
    };
  }, []);

"@

$firstIndex = $content.IndexOf($anchor)

if ($firstIndex -lt 0) {
    Write-Host "ERROR: Component anchor not found. Nothing changed." -ForegroundColor Red
    exit
}

if ($content.Contains("SUCCESS: Anam live avatar connected.")) {
    Write-Host "ERROR: Anam connection code already exists. Nothing changed." -ForegroundColor Yellow
    exit
}

$content = $content.Insert($firstIndex, $insert)

Set-Content $file $content -Encoding UTF8

Write-Host "SUCCESS: Anam connection added once." -ForegroundColor Green
