
describe("notes", function() {
  it("less than", function() {
    expect(notesLessThan("C5", "C#5")).toBe(true);
    expect(notesLessThan("B5", "D6")).toBe(true);
    expect(notesLessThan("B5", "B5")).toBe(false);
  });

  it("greater than", function() {
    expect(notesGreaterThan("G5", "C#5")).toBe(true);
    expect(notesGreaterThan("G5", "Fb5")).toBe(true);
    expect(notesGreaterThan("E#5", "F5")).toBe(false);
  });

  it("compare", function() {
    expect(compareNotes("E#5", "F5")).toBe(0);
  });

  it("gets note names", function() {
    let pitches = [24,25,26,27,28,29,30,31,32,33,34,35,36]

    // sharpened
    expect(pitches.map((p) => noteName(p))).toEqual([
      "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3"
    ])

    // flattened
    expect(pitches.map((p) => noteName(p, false))).toEqual([
      "C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3"
    ])

  })

  it("gets notes pitches", function() {
    let sharpNames = [
      "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3"
    ]

    let flatNames = [
      "C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3"
    ]

    expect(sharpNames.map((n) => parseNote(n))).toEqual([
      24,25,26,27,28,29,30,31,32,33,34,35,36
    ])

    expect(flatNames.map((n) => parseNote(n))).toEqual([
      24,25,26,27,28,29,30,31,32,33,34,35,36
    ])

  })
});

describe("scales", function() {
  it("gets notes in C MajorScale", function() {
    let scale = new MajorScale("C");
    expect(scale.getRange(5)).toEqual([
      "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"
    ]);
  });

  it("gets notes in D MajorScale", function() {
    let scale = new MajorScale("D");
    expect(scale.getRange(5)).toEqual([
      "D5", "E5", "F#5", "G5", "A5", "B5", "C#6", "D6"
    ]);
  });

  it("gets notes in F MajorScale", function() {
    let scale = new MajorScale("F");
    // TODO: should be Bb5
    expect(scale.getRange(5)).toEqual([
      "F5", "G5", "A5", "A#5", "C6", "D6", "E6", "F6"
    ]);
  });

  it("gets notes in loose range for scale", function() {
    let scale = new MajorScale("G");
    let range = scale.getLooseRange("C5", "C6")
    expect(range).toEqual([
      "C5", "D5", "E5", "F#5", "G5", "A5", "B5", "C6"
    ]);
  });

  it("gets scale degrees for C major", function() {
    let scale = new MajorScale("C")
    let range = scale.getLooseRange("C5", "C6")

    expect(range.map(scale.getScaleDegree.bind(scale))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 1
    ])
  })

  it("gets scale degrees for G major", function() {
    let scale = new MajorScale("G")
    let range = scale.getLooseRange("C5", "C6")

    expect(range.map(scale.getScaleDegree.bind(scale))).toEqual([
      4, 5, 6, 7, 1, 2, 3, 4
    ])
  })
})

describe("key signature", function() {
  let trebleCleff = ["A4", "C7"]
  let bassCleff = ["C3", "E5"]

  it("gets name for key signature", function() {

    expect(new KeySignature(0).name()).toBe("C")

    expect(new KeySignature(1).name()).toBe("G")
    expect(new KeySignature(2).name()).toBe("D")
    expect(new KeySignature(3).name()).toBe("A")
    expect(new KeySignature(4).name()).toBe("E")
    expect(new KeySignature(5).name()).toBe("B")

    expect(new KeySignature(-1).name()).toBe("F")
    expect(new KeySignature(-2).name()).toBe("Bb")
    expect(new KeySignature(-3).name()).toBe("Eb")
    expect(new KeySignature(-4).name()).toBe("Ab")
    expect(new KeySignature(-5).name()).toBe("Db")
    expect(new KeySignature(-6).name()).toBe("Gb")
  })

  it("gets key signature notes for C", function() {
    let key = new KeySignature(0)

    expect(key.isFlat()).toBe(false)
    expect(key.isSharp()).toBe(false)

    expect(key.accidentalNotes()).toEqual([])

    expect(key.notesInRange(...trebleCleff)).toEqual([])
  })

  it("gets key signature notes for D", function() {
    let key = new KeySignature(2)

    expect(key.isFlat()).toBe(false)
    expect(key.isSharp()).toBe(true)

    expect(key.accidentalNotes()).toEqual(["F", "C"])

    expect(key.notesInRange(...trebleCleff)).toEqual(["F5", "C6"])
    expect(key.notesInRange(...trebleCleff)).toEqual(["F5", "C6"])
  })

  it("gets key signature notes for Bb", function() {
    let key = new KeySignature(-2)
    expect(key.isFlat()).toBe(true)
    expect(key.isSharp()).toBe(false)

    expect(key.accidentalNotes()).toEqual(["B", "E"])

    expect(key.notesInRange(...trebleCleff)).toEqual(["B5", "E5"])
    expect(key.notesInRange(...trebleCleff)).toEqual(["B5", "E5"])
  })

  it("gets key signature notes for E", function() {
    let key = new KeySignature(4)
    expect(key.isFlat()).toBe(false)
    expect(key.isSharp()).toBe(true)

    expect(key.accidentalNotes()).toEqual(["F", "C", "G", "D"])

    expect(key.notesInRange(...trebleCleff)).toEqual(["F5", "C6", "G6", "D6"])
    expect(key.notesInRange(...trebleCleff)).toEqual(["F5", "C6", "G6", "D6"])
  })

  it("gets accidentals for notes in D", function() {
    let key = new KeySignature(2) // f c
    let examples = [
      ["C5", 0],
      ["C#5", null],
      ["Cb5", -1],

      ["D5", null],
      ["D#5", 1],
      ["Db5", -1],

      ["E5", null],
      ["E#5", 1],
      ["Eb5", -1],

      ["F5", 0],
      ["F#5", null],
      ["Fb5", -1],

      ["G5", null],
      ["G#5", 1],
      ["Gb5", -1],

      ["A5", null],
      ["A#5", 1],
      ["Ab5", -1],

      ["B5", null],
      ["B#5", 1],
      ["Bb5", -1],
    ]

    for (let [note, accidentals] of examples) {
      expect(key.accidentalsForNote(note)).toBe(accidentals)
    }
  })

  it("gets accidentals for notes in Eb", function() {
    let key = new KeySignature(-3) // b e a

    let examples = [
      ["C5", null],
      ["C#5", 1],
      ["Cb5", -1],

      ["D5", null],
      ["D#5", 1],
      ["Db5", -1],

      ["E5", 0],
      ["E#5", 1],
      ["Eb5", null],

      ["F5", null],
      ["F#5", 1],
      ["Fb5", -1],

      ["G5", null],
      ["G#5", 1],
      ["Gb5", -1],

      ["A5", 0],
      ["A#5", 1],
      ["Ab5", null],

      ["B5", 0],
      ["B#5", 1],
      ["Bb5", null],
    ]

    for (let [note, accidentals] of examples) {
      expect(key.accidentalsForNote(note)).toBe(accidentals)
    }
  })

  it("gets enharmonic spelling of notes for key", function() {
    let key = new KeySignature(-3) // b e a
    let notes = new MajorScale(key.name()).getRange(4).map((n) => key.enharmonic(n))

    expect(notes).toEqual([
        "Eb4", "F4", "G4", "Ab4", "Bb4", "C5", "D5", "Eb5"
    ])
  })
})
