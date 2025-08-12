import TopSection from "../components/top-section/TopSection";
import ProjectSection from "../components/project-section/project-section";
import CulturalCarousel from "../components/cultural-carroussel/cultural-carroussel";   
import './home.css';

function Home(){
    return(
        <>
        <TopSection />
        <ProjectSection/>
        <CulturalCarousel/>
        </>
    )
}

export default Home