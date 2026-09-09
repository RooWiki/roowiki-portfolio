interface GalleryCardProps {
  name: string
  url: string
  image: string
  imageAlt: string
}

export default function GalleryCard({ name, url, image, imageAlt }: GalleryCardProps) {
  return (
    <a className="rw-square-card" href={url} target="_blank" rel="noopener noreferrer" title={name} aria-label={`${name} (opens in new tab)`}>
      <img src={image} alt={imageAlt} width="600" height="600" loading="lazy" decoding="async" />
    </a>
  )
}
