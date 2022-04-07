import Layout from "../views/Layout";
import { uniqueId } from 'lodash';
import { HomeCanvas } from "../components/HomeCanvas";
import { RGBHeading } from "../components/RGBHeading";

export default function Home ( props ) {
    return <Layout>
        <section className="viewport-section window-height subtract-header-height content-centered-vertically">
            <div className="section-background-group" >
                <div className="background-underlay gray-gradient" ></div>
                <HomeCanvas id="hero-canvas" className="background-canvas" />
                <div className="background-overlay " ></div>
            </div>
            <div className="section-adornments-group" >
                <div className="shape rectangle z45deg bgcolor-primary abspos-50-50" ></div>
                <div className="shape rectangle z-45deg bgcolor-highlight abspos-50-45" ></div>
                <div className="shape rectangle z45deg bgcolor-lowlight abspos-50-40" ></div>
            </div>
            <div className="section-content-group " >
                <h1>
                    <p><span className="color-highlight">Hello</span> there.</p>
                    <p>I'm <span className="color-primary">Tyler</span>, a web developer.</p>
                </h1>
                <ul className="slashed-list">
                    <li>Developement</li>
                    <li>Design</li>
                    <li>Photography</li>
                </ul>
                <button className="call-to-action" ><a href="#">Contact me
                    <div className="triangle"></div>
                    <div className="arrow edge" >
                        <div className="upper" ></div>
                        <div className="lower" ></div>
                    </div>
                    <div className="arrow floating" >
                        <div className="upper" ></div>
                        <div className="lower" ></div>
                    </div>
                </a></button>
            </div>
        </section>
        <nav className="main-navigation" >
            <div className="content-group" >
                <ul className="menu">
                    {props.navigation.map( l => {
                        return <li key={uniqueId( 'nav-item-' )}>{l}</li>;
                    } )}
                </ul>
            </div>
        </nav>
        <section className="viewport-section">
            <div className="section-background-group" >
                <div className="background-underlay" ></div>
                {/* <img className="background-image" src="" alt=""> */}
                <div className="background-overlay" ></div>
            </div>
            <div className="section-content-group" >
                <RGBHeading headingLevel={2} >Technical Skills</RGBHeading>
                <p>In my {`${new Date().getFullYear() - 2015}`} years of experience working as a web developer and designer I've acquired a sizable skillset that gives me the ability to tackle a variety problems, from graphics manipulation to REST APIs and everything inbetween. </p>
                <ul className="stylized-tags" >
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>SASS</li>
                    <li>Boostrap</li>
                    <li>jQuery</li>
                    <li>Vue.js</li>
                    <li>React</li>
                    <li>Polymer</li>
                    <li>UI Design</li>
                    <li>Animations</li>
                    <li>JavaScript</li>
                    <li>PHP</li>
                    <li>Python</li>
                    <li>Java</li>
                    <li>frameworks</li>
                    <li>Content Managment Systems</li>
                    <li>Wordpress</li>
                    <li>Laravel</li>
                    <li>Django</li>
                    <li>Express</li>
                    <li>Android</li>
                    <li>git</li>
                    <li>github</li>
                    <li>Webpack</li>
                    <li>npm</li>
                    <li>composer</li>
                    <li>SQL</li>
                    <li>MySQL</li>
                    <li>MariaDB</li>
                    <li>Unix/Linux OS</li>
                    <li>Amazon Web Services</li>
                    <li>Search Engine Optimization</li>
                    <li>Google advertising suite</li>
                    <li>graphic design</li>
                    <li>Adobe Suite</li>
                    <li>Affinity Suite</li>
                    <li>Photography</li>
                </ul>
            </div>
        </section>
        <section className="viewport-section">
            <div className="section-background-group" >
                <div className="background-underlay" ></div>
                {/* <img className="background-image" src="" alt=""> */}
                <div className="background-overlay" ></div>
            </div>
            <div className="section-content-group" >
                <RGBHeading headingLevel={2} >Website Portfolio</RGBHeading>
                <p>These are many projects that I have helped bring to life over the years. These are among the most prominent and I'm proud of the personal touch and care I was able to imbue them with.</p>
                <ul className="portfolio-grid">
                    <li className="portfolio-item" >
                        <figure className="portfolio-card" >
                            <figcaption>Paul Jr. Designs</figcaption>
                            <img
                                src="media/portfolio/websites/screencapture-pauljrdesigns-com-1595190450307.png"
                                alt=""
                            />
                            <a href="#"></a>
                        </figure>
                    </li>
                    <li className="portfolio-item" >
                        <figure className="portfolio-card" >
                            <figcaption>DIF Design</figcaption>
                            <img
                                src="media/portfolio/websites/screencapture-difdesign-com-1595190336000.png"
                                alt=""
                            />
                            <a href="#"></a>
                        </figure>
                    </li>
                    <li className="portfolio-item" >
                        <figure className="portfolio-card" >
                            <figcaption>Swipe for a Cause</figcaption>
                            <img
                                src="media/portfolio/websites/screencapture-swipeforacause-com-1595190617515.png"
                                alt=""
                            />
                            <a href="#"></a>
                        </figure>
                    </li>
                    <li className="portfolio-item" >
                        <figure className="portfolio-card" >
                            <figcaption>Willett Builders</figcaption>
                            <img
                                src="media/portfolio/websites/screencapture-willettbuilders-com-1595194519715.png"
                                alt=""
                            />
                            <a href="#"></a>
                        </figure>
                    </li>

                </ul>

            </div>
        </section>
    </Layout>;
}