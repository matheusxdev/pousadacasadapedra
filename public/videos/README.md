# Vídeos da Seção de Serviços

Este diretório contém os vídeos utilizados na seção de serviços da homepage.

## Arquivos disponíveis:

- **services.mp4** - Vídeo principal em formato MP4 (recomendado)
- **services.mov** - Vídeo original em formato QuickTime/MOV

## Especificações do vídeo atual:

- **Formato**: MP4 (H.264)
- **Localização**: `/public/videos/services.mp4`
- **Uso**: Vídeo de fundo da seção de serviços
- **Comportamento**: Autoplay, muted, loop infinito
- **Resolução**: 2160x3840 (4K vertical)
- **Duração**: 7.57 segundos
- **Tamanho**: ~6.2MB

## Fallback:

Se o vídeo não carregar, o sistema utilizará uma imagem de fallback do Unsplash.

## Otimização recomendada:

Para melhor compatibilidade com navegadores web, considere converter o vídeo para formatos mais web-friendly:

1. **MP4 (H.264)** - Melhor compatibilidade
2. **WebM** - Melhor compressão

## Comando para conversão (FFmpeg):

```bash
# Converter para MP4
ffmpeg -i services.mov -c:v libx264 -c:a aac services.mp4

# Converter para WebM
ffmpeg -i services.mov -c:v libvpx-vp9 -c:a libopus services.webm
```

## Exemplo de vídeo ideal:

- Mostrar piscina da pousada
- Restaurante em funcionamento
- Quartos confortáveis
- Área de lazer
- Vista panorâmica de Búzios

## Performance:

- Use ferramentas como FFmpeg para otimizar os vídeos
- Considere usar vídeos com movimento sutil para melhor performance
- Teste em diferentes dispositivos e conexões
