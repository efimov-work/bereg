"""Encode the facade clip forwards then backwards, without duplicated endpoints."""
from pathlib import Path
import json
import subprocess

root = Path(__file__).resolve().parents[1] / 'public' / 'assets' / 'videos'
source = root / '02_architecture_detail.mp4'
output = root / '02_architecture_pingpong.mp4'
probe = json.loads(subprocess.check_output([
    'ffprobe', '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=nb_frames', '-of', 'json', str(source),
]))
frames = int(probe['streams'][0]['nb_frames'])
if frames < 3:
    raise ValueError('The source needs at least three frames')
filters = (
    '[0:v]setpts=PTS-STARTPTS,split=2[forward][reverse];'
    f'[reverse]reverse,trim=start_frame=1:end_frame={frames-1},'
    'setpts=PTS-STARTPTS[backward];'
    '[forward][backward]concat=n=2:v=1:a=0,format=yuv420p[out]'
)
subprocess.run([
    'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
    '-filter_complex', filters, '-map', '[out]', '-an',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(output),
], check=True)
print(f'{output.name}: {frames * 2 - 2} frames, {output.stat().st_size:,} bytes')
