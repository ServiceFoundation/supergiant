package clustercheck

import (
	"context"
	"io"
	"text/template"

	"github.com/pkg/errors"

	tm "github.com/supergiant/supergiant/pkg/templatemanager"
	"github.com/supergiant/supergiant/pkg/workflows/steps"
	"github.com/supergiant/supergiant/pkg/workflows/steps/kubelet"
)

const StepName = "clustercheck"

type Step struct {
	script *template.Template
}

func Init() {
	steps.RegisterStep(StepName, New(tm.GetTemplate(StepName)))
}

func New(script *template.Template) *Step {
	t := &Step{
		script: script,
	}

	return t
}

func (s *Step) Run(ctx context.Context, out io.Writer, config *steps.Config) error {
	err := steps.RunTemplate(ctx, s.script, config.Runner, out, config.ClusterCheckConfig)

	if err != nil {
		return errors.Wrap(err, "cluster check step")
	}

	return nil
}

func (s *Step) Name() string {
	return StepName
}

func (s *Step) Rollback(context.Context, io.Writer, *steps.Config) error {
	return nil
}

func (s *Step) Description() string {
	return ""
}

func (s *Step) Depends() []string {
	return []string{kubelet.StepName}
}
