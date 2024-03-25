import { useEffect, useRef } from "react";
import { Engine, Render, Bodies, World, Events } from "matter-js";

function App() {
  const scene = useRef();
  const engine = useRef(Engine.create());

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ]);

    Engine.run(engine.current);
    Render.run(render);

    // 衝突時のイベントを追加
    const collisionHandler = (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        if (pair.bodyA.label === "orange" && pair.bodyB.label === "orange") {
          mergeBodies(pair);
        }
      });
    };

    Events.on(engine.current, "collisionStart", collisionHandler);

    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};

      // クリーンアップ時にイベントリスナーを削除
      Events.off(engine.current, "collisionStart", collisionHandler);
    };
  }, []);

  const addCircle = (x, y) => {
    const orange = Bodies.circle(x, y, 20, {
      density: 0.0005,
      render: {
        fillStyle: "#ff8800",
      },
      label: "orange",
    });
    World.add(engine.current.world, orange);
  };

  function mergeBodies(pair) {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;

    const newX = (bodyA.position.x + bodyB.position.x) / 2;
    const newY = (bodyA.position.y + bodyB.position.y) / 2;
    const newRadius = Math.sqrt(
      bodyA.circleRadius * bodyA.circleRadius +
        bodyB.circleRadius * bodyB.circleRadius
    );

    World.remove(engine.current.world, [bodyA, bodyB]);

    const newBody = Bodies.circle(newX, newY, newRadius);
    World.add(engine.current.world, newBody);
  }

  return (
    <div
      onMouseDown={() => {
        addCircle(200, 200);
      }}
    >
      <div ref={scene} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default App;
