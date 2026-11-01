"""Build the forward-only, cyclic hero film from existing project assets.

Requires ffmpeg locally. Existing videos can be served without regeneration.
"""
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[1] / "public" / "assets"
# Two exterior shots. Interiors and wellness footage belong in their own section.
scenes = ["01_hero_drone", "04_sea_view_terrace"]
clip_duration = 5.6
transition = 0.6
sources = scenes + [scenes[0]]
command = [
    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
    "-filter_complex_threads", "1",
]
for scene in sources:
    command += ["-i", str(root / "videos" / f"{scene}.mp4")]

filters = []
for index in range(len(sources)):
    duration = transition if index == len(scenes) else clip_duration
    filters.append(
        f"[{index}:v]trim=start=0.2:duration={duration},"
        "setpts=PTS-STARTPTS,fps=24,"
        "scale=1280:712:force_original_aspect_ratio=decrease,"
        "pad=1280:712:(ow-iw)/2:(oh-ih)/2,"
        f"setsar=1,format=yuv420p[v{index}]"
    )
for index in range(1, len(sources)):
    previous = "v0" if index == 1 else f"x{index - 1}"
    offset = index * (clip_duration - transition)
    filters.append(
        f"[{previous}][v{index}]xfade=transition=fadeblack:"
        f"duration={transition}:offset={offset:.3f}[x{index}]"
    )
# The final transition lands at the same frame as the trimmed beginning.
# Every shot runs forwards at its original speed; the native loop has no cut.
filters.append(
    f"[x{len(scenes)}]trim=start={transition},setpts=PTS-STARTPTS[out]"
)
output = root / "videos" / "00_coastal_sequence.mp4"
staged = output.with_name("00_coastal_sequence-staged.mp4")
command += [
    "-filter_complex", ";".join(filters), "-map", "[out]", "-an",
    "-c:v", "libx264", "-crf", "21", "-preset", "fast",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(staged),
]
subprocess.run(command, check=True)
staged.replace(output)
subprocess.run([
    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
    "-i", str(output), "-frames:v", "1", "-q:v", "2",
    str(root / "images" / "00_coastal_sequence-poster.jpg"),
], check=True)
print(f"Created {output.name}: {output.stat().st_size:,} bytes")
