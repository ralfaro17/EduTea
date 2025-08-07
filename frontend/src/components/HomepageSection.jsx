import PropTypes from 'prop-types';

const possibleColors = ["bg-white", "bg-tea-green"];

function HomepageSection({title, description, imagePath, bgColor}) {

  return (
    <section className={bgColor + " flex p-12 gap-12 flex-col items-center md:flex-row"}>
      <div>
        <h1 className='font-bold text-[3rem]'>{title}</h1>
        <p>{description}</p>
      </div>
      <div>
        <img src={imagePath} alt='illustration' />
      </div>
    </section>
  )
}

HomepageSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
  bgColor: PropTypes.oneOf(possibleColors).isRequired
};

export default HomepageSection