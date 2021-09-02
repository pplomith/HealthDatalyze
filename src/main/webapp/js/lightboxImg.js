import ReactDOM from "react-dom";
import React from "react";
import Lightbox from "react-image-lightbox";
var images = [];
//function to create a lightbox element to display the diagnostic result
export const renderLightbox = (pathImg, idDiv) => {
    //set images path
    images = pathImg;
    const contentDiv = document.getElementById(idDiv);
    const gridProps = window.gridProps || {};
    ReactDOM.render(React.createElement(lightBoxExample, gridProps), contentDiv);
}

class lightBoxExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            isOpen: false
        };
    }
    render() {
        const { photoIndex, isOpen } = this.state;

        return (
            <div>
                <button type="button" className={"btn btn-primary"} onClick={() => this.setState({ isOpen: true })}>
                    <i className="fas fa-files-medical"></i>
                </button>

                {isOpen && (
                    <Lightbox
                        // main image displayed
                        mainSrc={images[photoIndex]}
                        //set the next image
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        //set the previous image
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        //close button event
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        //prev button event
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length
                            })
                        }
                        //next button event
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % images.length
                            })
                        }
                    />
                )}
            </div>
        )
    }
}
