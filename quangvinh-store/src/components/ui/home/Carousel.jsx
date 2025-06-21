import sliderpic2 from '../../../assets/images/banner.png';
import sliderpic3 from '../../../assets/images/meobanner.png';

function Carousel() {

    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative w-full overflow-hidden shadow-lg">
                <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
                    <img
                        src={sliderpic2}
                        alt="Slide 1"
                        id="slide-1"
                        className="flex-shrink-0 w-full h-[500px] object-cover snap-start"
                    />
                    <img
                        src={sliderpic3}
                        alt="Slide 2"
                        id="slide-2"
                        className="flex-shrink-0 w-full h-[500px] object-cover snap-start"
                    />
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    <button
                        onClick={() => handleScrollTo('slide-1')}
                        className="w-3 h-3 rounded-full bg-white/70 hover:bg-white transition duration-200"
                        aria-label="Chuyển đến slide 1"
                    />
                    <button
                        onClick={() => handleScrollTo('slide-2')}
                        className="w-3 h-3 rounded-full bg-white/70 hover:bg-white transition duration-200"
                        aria-label="Chuyển đến slide 2"
                    />
                </div>

            </div>
        </div>
    );
}

export default Carousel;
