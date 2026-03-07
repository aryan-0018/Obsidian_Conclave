import React from "react";
import { APP_CONFIG } from "../../utils/constants";
import { FaComments, FaShieldAlt, FaUsers, FaVideo } from "react-icons/fa";

const iconMap = {
  FaVideo: FaVideo,
  FaComments: FaComments,
  FaShieldAlt: FaShieldAlt,
  FaUsers: FaUsers,
};

const colorMap = {
  blue: "bg-obsidian-gold/10 text-obsidian-gold",
  green: "bg-obsidian-gold/10 text-obsidian-gold",
  purple: "bg-obsidian-gold/10 text-obsidian-gold",
  indigo: "bg-obsidian-gold/10 text-obsidian-gold",
};
const FeaturesGrid = () => {
  const features = APP_CONFIG.FEATURES.slice(0, 4);
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => {
        const IconComponent = iconMap[feature.icon];
        return (
          <div
            key={index}
            className="bg-obsidian-card rounded-xl p-6 shadow-md border border-obsidian-border hover:border-obsidian-gold/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 group cursor-default"
          >
            <div
              className={`w-12 h-12  ${colorMap[feature.color]} rounded-lg flex items-center justify-center mb-4`}
            >
              {IconComponent && <IconComponent className="w-6 h-6" />}
            </div>
            <h4 className="font-semibold text-obsidian-text mb-2">
              {feature.title}
            </h4>
            <p className="text-sm text-obsidian-muted">{feature.shortDescription}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturesGrid;
