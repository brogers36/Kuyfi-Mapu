"""Re-render only the shots whose sprites changed (boss battle shots, the Ngoymatulfe close-up and breakdown),
passing every other frame of the current film through untouched (titles, heroes, the post-credits stinger, the music).
usage: python3 compose_fix.py out.mp4 [preview_frame ...]"""
import sys, subprocess, numpy as np
from PIL import Image
sys.argv, args = [sys.argv[0]], sys.argv[1:]
import compose as C
BOSS = {C.fr(t) for t in (32, 33.6, 35.2, 36.8333, 38.4333, 40, 41.6, 43.2, 64, 65.6, 67.2, 68.8, 70.4)}
keep = lambda a: a in BOSS or a == C.fr(11.2333) or C.fr(76.8) <= a < C.fr(86.4)
C.SEG[:] = [s for s in C.SEG if keep(s[0])]
C.WAR = (-1, -1)   # the Wariache patch is already in the film: do not apply it twice
def render(fi, orig):
    for (a, b, fn) in C.SEG:
        if a <= fi < b: return fn(fi - a, b - a)
    return orig
out, prev = args[0], [int(x) for x in args[1:]]
if prev:
    for fi, f in enumerate(C.frames_of_original()):
        if fi in prev: Image.fromarray(render(fi, f)).save('/tmp/ef/pv_%04d.png' % fi)
        if fi >= max(prev): break
    sys.exit()
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (C.W, C.H), '-r', str(C.FPS), '-i', '-', '-i', C.SRC,
                        '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
n = 0
for fi, f in enumerate(C.frames_of_original()):
    enc.stdin.write(np.ascontiguousarray(render(fi, f)).tobytes()); n += 1
enc.stdin.close(); enc.wait(); print('frames', n, 'segments', len(C.SEG))
