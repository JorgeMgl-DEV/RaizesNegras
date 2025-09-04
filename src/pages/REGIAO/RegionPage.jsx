import { useParams } from "react-router-dom"

export default function RegionPage() {
    const { slug } = useParams()
    return (
        <main style={{ padding: "72px 20px 32px" }}>
            <h1 style={{ fontSize: "clamp(24px,3vw,40px)" }}>Região: {slug}</h1>
            <p style={{ maxWidth: 800, lineHeight: 1.5 }}>Em breve conteúdo desta região.</p>
        </main>
    )
}
