// Busca o endereço completando automático pelo CEP (ViaCEP)
export async function buscarEnderecoPorCep(cep) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return await res.json();
}

// Converte o nome da rua em Latitude e Longitude para o Mapa (OpenStreetMap)
export async function buscarCoordenadasPorEndereco(enderecoCompleto) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`);
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}