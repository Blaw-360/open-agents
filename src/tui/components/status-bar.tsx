import React, { memo, useState, useEffect } from "react";
import { Box, Text } from "ink";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const SPINNER_INTERVAL = 80;

function Spinner() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, SPINNER_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return <Text color="yellow">{SPINNER_FRAMES[frame]} </Text>;
}

type StatusBarProps = {
  isStreaming: boolean;
  elapsedSeconds: number;
  tokens: number;
  status?: string;
};

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`;
  }
  return String(tokens);
}

// Status indicator - not memoized to allow spinner animation
function StatusIndicator({
  isStreaming,
  status
}: {
  isStreaming: boolean;
  status?: string;
}) {
  if (isStreaming) {
    return (
      <>
        <Spinner />
        <Text color="yellow">{status || "Thinking..."}</Text>
      </>
    );
  }
  return <Text color="green">✓ {status || "Done"}</Text>;
}

// Memoized time/token display - this part changes frequently so isolated
const StatusMeta = memo(function StatusMeta({
  elapsedSeconds,
  tokens
}: {
  elapsedSeconds: number;
  tokens: number;
}) {
  return (
    <Text color="gray">
      {" "}({formatTime(elapsedSeconds)} · ↓ {formatTokens(tokens)} tokens · esc to interrupt)
    </Text>
  );
});

// Not memoized to allow spinner animation
export function StatusBar({
  isStreaming,
  elapsedSeconds,
  tokens,
  status
}: StatusBarProps) {
  if (!isStreaming && !status) {
    return null;
  }

  return (
    <Box marginTop={1}>
      <StatusIndicator isStreaming={isStreaming} status={status} />
      <StatusMeta elapsedSeconds={elapsedSeconds} tokens={tokens} />
    </Box>
  );
}
