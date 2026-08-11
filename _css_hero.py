"""CSS update: make hero-visual match left content's visual weight."""
with open('css/style.css', 'r', encoding='utf-8') as f:
    s = f.read()

old_v = """.hero-visual {
    position: relative; aspect-ratio: 1 / 1;
    max-width: 420px; margin: 0 auto;
}"""
new_v = """.hero-visual {
    position: relative; width: 100%;
    max-width: 540px; margin: 0 auto;
    display: flex; align-items: center; justify-content: center;
}
.hero-dashboard-img {
    width: 100%; height: auto; display: block;
    border-radius: 24px;
    filter: drop-shadow(0 24px 60px rgba(110,198,255,.18));
    animation: heroFloat 8s ease-in-out infinite;
}
@keyframes heroFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}"""
s = s.replace(old_v, new_v)

# Tighten hero padding to balance the larger visual
s = s.replace(".hero {\n    position: relative; min-height: 100vh;\n    display: flex; align-items: center;\n    padding: 160px 0 100px; overflow: hidden;\n}",
              ".hero {\n    position: relative;\n    display: flex; align-items: center;\n    padding: 140px 0 90px; overflow: hidden;\n}")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(s)
print('[ok] CSS updated')