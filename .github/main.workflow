workflow "Build and test on push" {
  on = "push"
  resolves = ["Test", "Lint"]
}

action "Install" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  args = "install"
}

action "Test" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Install"]
  args = "test"
}

action "Lint" {
  uses = "actions/npm@de7a3705a9510ee12702e124482fad6af249991b"
  needs = ["Install"]
  args = "run lint"
}
