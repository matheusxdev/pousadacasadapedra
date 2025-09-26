# Vídeos da Página "Sobre Nós"

Este diretório contém os vídeos utilizados na página "Sobre Nós".

## Estrutura recomendada:

### Hero Section:
- **about-hero.mp4** - Vídeo principal do hero (1920x1080, 10-30 segundos)
- **about-hero.webm** - Versão WebM para melhor compressão

### Nossa História:
- **about-story.mp4** - Vídeo da seção "Nossa História" (800x600, 15-30 segundos)
- **about-story.webm** - Versão WebM

### Nossa Missão:
- **about-mission.mp4** - Vídeo da seção "Nossa Missão" (800x600, 15-30 segundos)
- **about-mission.webm** - Versão WebM

## Especificações técnicas:

### Vídeo Hero:
- **Resolução**: 1920x1080 (Full HD) ou superior
- **Duração**: 10-30 segundos (loop infinito)
- **Formato**: MP4 (H.264) + WebM
- **Tamanho**: Máximo 15MB por arquivo
- **Bitrate**: 5-8 Mbps

### Vídeos das Seções:
- **Resolução**: 800x600 ou 1280x720
- **Duração**: 15-30 segundos
- **Formato**: MP4 (H.264) + WebM
- **Tamanho**: Máximo 10MB por arquivo
- **Bitrate**: 3-5 Mbps

## Comandos para conversão (FFmpeg):

```bash
# Converter para MP4 (Hero)
ffmpeg -i input.mov -c:v libx264 -c:a aac -movflags +faststart -b:v 6M about-hero.mp4

# Converter para WebM (Hero)
ffmpeg -i input.mov -c:v libvpx-vp9 -c:a libopus -b:v 4M about-hero.webm

# Converter para MP4 (Seções)
ffmpeg -i input.mov -c:v libx264 -c:a aac -movflags +faststart -b:v 4M about-story.mp4

# Converter para WebM (Seções)
ffmpeg -i input.mov -c:v libvpx-vp9 -c:a libopus -b:v 3M about-story.webm
```

## Conteúdo sugerido:

### Hero:
- Vista panorâmica de Búzios
- Piscinas das pousadas
- Atividades dos hóspedes
- Pôr do sol na praia

### História:
- Fundação da empresa
- Evolução das pousadas
- Depoimentos de hóspedes
- Momentos históricos

### Missão:
- Atendimento personalizado
- Sustentabilidade
- Conexão com a natureza
- Experiências únicas

## Otimização:

- Use movimento sutil para melhor performance
- Evite transições muito rápidas
- Teste em diferentes dispositivos e conexões
- Considere usar vídeos sem áudio para autoplay
