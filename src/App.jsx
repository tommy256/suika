import { useEffect, useRef } from "react";
import { Engine, Render, Bodies, World } from "matter-js";

function App() {
  const scene = useRef();
  // const isPressed = useRef(false);
  const engine = useRef(Engine.create());

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    // 描画エリアの設定
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

    // 画面の外周に壁を追加
    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ]);

    // エンジンを実行
    Engine.run(engine.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  // マウスを押したら円を追加
  const addCircle = (x, y) => {
    const circle = Bodies.circle(x, y, 20, {
      restitution: 0.8,
      friction: 0.01,
      density: 0.001,
      render: {
        fillStyle: "#ff8800",
      },
    });
    World.add(engine.current.world, circle);
  };

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
