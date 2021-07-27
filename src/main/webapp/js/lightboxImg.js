import ReactDOM from "react-dom";
import React from "react";
import Lightbox from "react-image-lightbox";
var images = [];
export const renderLightbox = (pathImg, idDiv) => {
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
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length
                            })
                        }
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
