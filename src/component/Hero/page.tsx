import React from "react";

const HeroComponent = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] p-4 max-sm:h-[calc(100vh-16rem)]">
      <div className="flex flex-col mt-20 text-center max-w-xl mx-auto max-sm:mt-10">
        <h2 className="text-xl font-bold">
          Organize Your Code Snippets
          <span className="text-purple-600 "> Effectively!</span>
        </h2>
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam
          molestias reiciendis praesentium consequatur rerum veritatis fugit
          repellendus maiores inventore, id earum doloremque dicta velit quas
          dignissimos tenetur. Repellat, tenetur nisi!
        </p>
      </div>
    </div>
  );
};

export default HeroComponent;
