import { createContext, useContext, useState, useCallback } from 'react';

const BuilderContext = createContext(null);

const EMPTY_BUILD = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  psu: null,
  casing: null,
  cooler: null,
};

export function BuilderProvider({ children }) {
  const [selectedComponents, setSelectedComponents] = useState(() => {
    // Restore from sessionStorage if exists
    try {
      const saved = sessionStorage.getItem('haniforge_builder');
      return saved ? JSON.parse(saved) : { ...EMPTY_BUILD };
    } catch {
      return { ...EMPTY_BUILD };
    }
  });
  const [budget, setBudget] = useState(() => {
    try {
      return Number(sessionStorage.getItem('haniforge_budget') || '0');
    } catch {
      return 0;
    }
  });

  const saveToSession = (comps, bud) => {
    try {
      sessionStorage.setItem('haniforge_builder', JSON.stringify(comps));
      sessionStorage.setItem('haniforge_budget', String(bud));
    } catch {}
  };

  const selectComponent = useCallback((category, component) => {
    setSelectedComponents(prev => {
      const updated = { ...prev, [category]: component };
      saveToSession(updated, budget);
      return updated;
    });
  }, [budget]);

  const removeComponent = useCallback((category) => {
    setSelectedComponents(prev => {
      const updated = { ...prev, [category]: null };
      saveToSession(updated, budget);
      return updated;
    });
  }, [budget]);

  const clearBuild = useCallback(() => {
    setSelectedComponents({ ...EMPTY_BUILD });
    setBudget(0);
    saveToSession({ ...EMPTY_BUILD }, 0);
  }, []);

  const updateBudget = useCallback((val) => {
    setBudget(val);
    saveToSession(selectedComponents, val);
  }, [selectedComponents]);

  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, comp) => sum + (comp ? Number(comp.price) : 0), 0
  );
  const remainingBudget = budget > 0 ? budget - totalPrice : 0;
  const isOverBudget = budget > 0 && totalPrice > budget;
  const percentageUsed = budget > 0 ? Math.min(100, Math.round((totalPrice / budget) * 100)) : 0;
  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;

  return (
    <BuilderContext.Provider value={{
      selectedComponents,
      budget,
      totalPrice,
      remainingBudget,
      isOverBudget,
      percentageUsed,
      selectedCount,
      selectComponent,
      removeComponent,
      clearBuild,
      updateBudget,
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider');
  return ctx;
}
