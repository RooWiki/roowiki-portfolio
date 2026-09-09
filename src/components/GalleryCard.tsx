interface GalleryCardProps {
  name: string
  url: string
  image: string
  imageAlt: string
  index: number
  category: string
}

export default function GalleryCard({ name, url, image, imageAlt, index, category }: GalleryCardProps) {
  return (
    <a className="rw-square-card" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in new tab)`}>
      <img src={image} alt={imageAlt} width="600" height="600" loading="lazy" decoding="async" />
      <span className="rw-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className="rw-card-caption">
        <div><span>{category}</span><h3>{name}</h3></div>
        <span className="rw-card-arrow" aria-hidden="true">↗</span>
      </div>
    </a>
  )
}
