import { AiExpression } from "../data/types";

const expressions: Record<NonNullable<AiExpression>, string> = {
  neutral:   "( -_- )",
  smile:     "( ^_^ )",
  smirk:     "( ¬‿¬ )",
  wink:      "( ^_~ )",
  thinking:  "( ._. )?",
  curious:   "( o_O )",
  surprised: "( O_O )",
  laughing:  "( ≧▽≦ )",
  sad:       "( T_T )",
  angry:     "( >_< )",
  sincere:   "( ◕‿◕ )",
};

interface Props {
  expression: AiExpression;
}

export default function AsciiExpression({ expression }: Props) {
  const face = expression ? expressions[expression] : expressions.neutral;
  return (
    <span className="ascii-face">{face}</span>
  );
}
