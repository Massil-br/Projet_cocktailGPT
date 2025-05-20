import fetch from 'node-fetch';

export async function getFortniteSkins(req, res) {
  try {
    const response = await fetch('https://fortnite-api.com/v2/cosmetics/br');
    const data = await response.json();
    const skins = data.data
      .filter(item => item.type.value === 'outfit' && item.name && item.images?.icon)
      .map(skin => ({
        name: skin.name,
        imageUrl: skin.images.icon
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // 👈 Tri alphabétique ici

    res.json(skins);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération skins Fortnite' });
  }
}
