
import React from 'react';

const ComponentsList = () => {
  // List of components that can be dragged onto the page
  const componentCategories = [
    {
      name: "Layout",
      components: [
        { id: "section", name: "Section" },
        { id: "container", name: "Container" },
        { id: "grid", name: "Grid" },
        { id: "column", name: "Column" }
      ]
    },
    {
      name: "Content",
      components: [
        { id: "heading", name: "Heading" },
        { id: "paragraph", name: "Paragraph" },
        { id: "button", name: "Button" },
        { id: "image", name: "Image" },
        { id: "icon", name: "Icon" }
      ]
    },
    {
      name: "Interactive",
      components: [
        { id: "form", name: "Form" },
        { id: "input", name: "Input" },
        { id: "accordion", name: "Accordion" },
        { id: "tabs", name: "Tabs" },
        { id: "timer", name: "Countdown Timer" }
      ]
    }
  ];

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
  };

  return (
    <div className="space-y-6 h-[calc(100vh-250px)] overflow-auto">
      {componentCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">{category.name}</h3>
          <div className="grid grid-cols-2 gap-2">
            {category.components.map((component) => (
              <div
                key={component.id}
                className="p-2 bg-gray-50 border rounded-md text-sm cursor-move hover:bg-gray-100 transition-colors flex items-center justify-center"
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
              >
                {component.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComponentsList;
